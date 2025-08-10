import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Target, TrendingUp, Calendar, MapPin, ExternalLink } from 'lucide-react';
import type { SEMPlan } from '~backend/sem/types';

interface PlanSummaryProps {
  plan: SEMPlan;
}

export function PlanSummary({ plan }: PlanSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Budget Breakdown */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Total Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 mb-2">
            ${plan.totalEstimatedCost.toLocaleString()}
          </div>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex justify-between">
              <span>Search:</span>
              <span>${plan.inputs.budgets.search.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shopping:</span>
              <span>${plan.inputs.budgets.shopping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>PMax:</span>
              <span>${plan.inputs.budgets.pmax.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Count */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 mb-2">
            {plan.keywords.length}
          </div>
          <div className="space-y-1 text-xs text-green-700">
            <div className="flex justify-between">
              <span>Ad Groups:</span>
              <span>{plan.adGroups.length}</span>
            </div>
            <div className="flex justify-between">
              <span>PMax Themes:</span>
              <span>{plan.searchThemes.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Performance */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Expected Conversions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 mb-2">
            {plan.expectedConversions.toFixed(0)}
          </div>
          <div className="text-xs text-purple-700">
            Based on 2% conversion rate
          </div>
        </CardContent>
      </Card>

      {/* Plan Details */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Plan Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-orange-900 mb-2">
            {new Date(plan.createdAt).toLocaleDateString()}
          </div>
          <div className="space-y-1 text-xs text-orange-700">
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="truncate">{new URL(plan.inputs.brandWebsite).hostname}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{plan.inputs.serviceLocations.length} locations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
