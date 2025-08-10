import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Target, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import backend from '~backend/client';

export function HomePage() {
  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => backend.sem.listPlans()
  });

  const totalPlans = plansData?.plans.length || 0;
  const totalBudget = plansData?.plans.reduce((sum, plan) => sum + plan.totalEstimatedCost, 0) || 0;
  const totalConversions = plansData?.plans.reduce((sum, plan) => sum + plan.expectedConversions, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Build Comprehensive SEM Plans
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create structured Search, Shopping, and Performance Max campaigns with keyword analysis, 
          bid recommendations, and downloadable reports.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" asChild>
            <Link to="/create">
              <Search className="h-5 w-5 mr-2" />
              Create New Plan
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/plans">
              View Existing Plans
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Plans</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalPlans}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Expected Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{totalConversions.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Avg. Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">2.0%</div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-600" />
              Keyword Discovery
            </CardTitle>
            <CardDescription>
              Generate comprehensive keyword lists using seed keywords or website analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Automated keyword generation</li>
              <li>• Search volume analysis</li>
              <li>• Competition assessment</li>
              <li>• Intent classification</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Campaign Structure
            </CardTitle>
            <CardDescription>
              Organize keywords into logical ad groups and campaign themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Brand, category, and competitor groups</li>
              <li>• Performance Max themes</li>
              <li>• Match type recommendations</li>
              <li>• Bid suggestions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              Get detailed analytics and downloadable reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Cost and conversion estimates</li>
              <li>• Shopping bid recommendations</li>
              <li>• Exportable data tables</li>
              <li>• Performance tracking</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recent Plans */}
      {plansData && plansData.plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Plans</CardTitle>
            <CardDescription>Your latest SEM plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plansData.plans.slice(0, 3).map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{plan.brandWebsite}</h3>
                    <p className="text-sm text-gray-600">
                      {plan.keywordCount} keywords • ${plan.totalEstimatedCost.toLocaleString()} budget
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/plans/${plan.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
            {plansData.plans.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link to="/plans">View All Plans</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
