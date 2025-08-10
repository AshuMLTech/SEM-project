import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { KeywordsTable } from '../components/KeywordsTable';
import { AdGroupsTable } from '../components/AdGroupsTable';
import { SearchThemesTable } from '../components/SearchThemesTable';
import { ShoppingBidsTable } from '../components/ShoppingBidsTable';
import { PlanSummary } from '../components/PlanSummary';
import { ExportButtons } from '../components/ExportButtons';
import backend from '~backend/client';

export function PlanDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => backend.sem.getPlan({ id: id! }),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Plan Not Found</h1>
        <p className="text-gray-600">The requested SEM plan could not be found.</p>
        <Button asChild>
          <Link to="/plans">Back to Plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ExternalLink className="h-6 w-6 mr-2 text-blue-600" />
              {new URL(plan.inputs.brandWebsite).hostname}
            </h1>
            <p className="text-gray-600">{plan.inputs.brandWebsite}</p>
          </div>
        </div>
        <ExportButtons plan={plan} />
      </div>

      {/* Plan Summary */}
      <PlanSummary plan={plan} />

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>Keywords Analysis</CardTitle>
          <CardDescription>
            Complete list of keywords with search volume, competition, and bid recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordsTable keywords={plan.keywords} />
        </CardContent>
      </Card>

      {/* Ad Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Search Campaign Ad Groups</CardTitle>
          <CardDescription>
            Organized keyword groups for your search campaigns with match type recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdGroupsTable adGroups={plan.adGroups} />
        </CardContent>
      </Card>

      {/* Search Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Max Themes</CardTitle>
          <CardDescription>
            Asset group themes for your Performance Max campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchThemesTable themes={plan.searchThemes} />
        </CardContent>
      </Card>

      {/* Shopping Bids */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping Campaign Bids</CardTitle>
          <CardDescription>
            Recommended CPC bids for your shopping campaigns by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShoppingBidsTable bids={plan.shoppingBids} />
        </CardContent>
      </Card>
    </div>
  );
}
