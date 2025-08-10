import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, X } from 'lucide-react';
import backend from '~backend/client';
import type { CreateSEMPlanRequest } from '~backend/sem/types';

export function CreatePlanPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    brandWebsite: '',
    competitorWebsite: '',
    serviceLocations: [''],
    shoppingBudget: '1000',
    searchBudget: '2000',
    pmaxBudget: '1500',
    seedKeywords: ''
  });

  const createPlanMutation = useMutation({
    mutationFn: (data: CreateSEMPlanRequest) => backend.sem.createPlan(data),
    onSuccess: (plan) => {
      toast({
        title: "SEM Plan Created",
        description: "Your comprehensive SEM plan has been generated successfully.",
      });
      navigate(`/plans/${plan.id}`);
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create SEM plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brandWebsite.trim()) {
      toast({
        title: "Validation Error",
        description: "Brand website is required.",
        variant: "destructive",
      });
      return;
    }

    const seedKeywords = formData.seedKeywords
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const request: CreateSEMPlanRequest = {
      inputs: {
        brandWebsite: formData.brandWebsite.trim(),
        competitorWebsite: formData.competitorWebsite.trim() || '',
        serviceLocations: formData.serviceLocations.filter(loc => loc.trim().length > 0),
        budgets: {
          shopping: parseFloat(formData.shoppingBudget) || 0,
          search: parseFloat(formData.searchBudget) || 0,
          pmax: parseFloat(formData.pmaxBudget) || 0
        }
      },
      seedKeywords: seedKeywords.length > 0 ? seedKeywords : undefined
    };

    createPlanMutation.mutate(request);
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: [...prev.serviceLocations, '']
    }));
  };

  const removeLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: prev.serviceLocations.filter((_, i) => i !== index)
    }));
  };

  const updateLocation = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: prev.serviceLocations.map((loc, i) => i === index ? value : loc)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create SEM Plan</h1>
        <p className="text-gray-600">
          Build a comprehensive Search, Shopping, and Performance Max campaign strategy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide your brand and competitor information for keyword analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandWebsite">Brand Website *</Label>
                <Input
                  id="brandWebsite"
                  type="url"
                  placeholder="https://yourbrand.com"
                  value={formData.brandWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, brandWebsite: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitorWebsite">Competitor Website</Label>
                <Input
                  id="competitorWebsite"
                  type="url"
                  placeholder="https://competitor.com"
                  value={formData.competitorWebsite}
                  onChange={(e) => setFormData(prev => ({ ...prev, competitorWebsite: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Service Locations</CardTitle>
            <CardDescription>
              Add the cities or regions where you provide services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.serviceLocations.map((location, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="City, State or Region"
                  value={location}
                  onChange={(e) => updateLocation(index, e.target.value)}
                />
                {formData.serviceLocations.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLocation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addLocation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </CardContent>
        </Card>

        {/* Budget Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>
              Set your monthly advertising budgets for each campaign type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shoppingBudget">Shopping Ads Budget ($)</Label>
                <Input
                  id="shoppingBudget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1000"
                  value={formData.shoppingBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, shoppingBudget: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="searchBudget">Search Ads Budget ($)</Label>
                <Input
                  id="searchBudget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2000"
                  value={formData.searchBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, searchBudget: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pmaxBudget">Performance Max Budget ($)</Label>
                <Input
                  id="pmaxBudget"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1500"
                  value={formData.pmaxBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, pmaxBudget: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seed Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>Seed Keywords (Optional)</CardTitle>
            <CardDescription>
              Provide initial keywords related to your business. If left empty, keywords will be generated from your website content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="digital marketing&#10;seo services&#10;ppc advertising&#10;social media marketing"
              value={formData.seedKeywords}
              onChange={(e) => setFormData(prev => ({ ...prev, seedKeywords: e.target.value }))}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter one keyword per line. These will be used to generate related keyword variations.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button type="submit" disabled={createPlanMutation.isPending}>
            {createPlanMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create SEM Plan
          </Button>
        </div>
      </form>
    </div>
  );
}
