import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, DollarSign, Target } from 'lucide-react';
import backend from '~backend/client';

export function PlansListPage() {
  const { data: plansData, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => backend.sem.listPlans()
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  const plans = plansData?.plans || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEM Plans</h1>
          <p className="text-gray-600">Manage and view your SEM campaign plans</p>
        </div>
        <Button asChild>
          <Link to="/create">Create New Plan</Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SEM plans yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first SEM plan to get started with structured campaign planning.
            </p>
            <Button asChild>
              <Link to="/create">Create Your First Plan</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                      {new URL(plan.brandWebsite).hostname}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {plan.brandWebsite}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{plan.keywordCount} keywords</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    <span>${plan.totalEstimatedCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {plan.expectedConversions.toFixed(1)} conversions
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link to={`/plans/${plan.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
