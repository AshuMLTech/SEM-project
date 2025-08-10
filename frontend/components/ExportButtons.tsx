import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Table } from 'lucide-react';
import type { SEMPlan } from '~backend/sem/types';

interface ExportButtonsProps {
  plan: SEMPlan;
}

export function ExportButtons({ plan }: ExportButtonsProps) {
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportKeywords = () => {
    const keywordsData = plan.keywords.map(keyword => ({
      keyword: keyword.keyword,
      searchVolume: keyword.searchVolume,
      topOfPageBidLow: keyword.topOfPageBidLow,
      topOfPageBidHigh: keyword.topOfPageBidHigh,
      competition: keyword.competition,
      intent: keyword.intent
    }));
    exportToCSV(keywordsData, `keywords-${plan.id}.csv`);
  };

  const exportAdGroups = () => {
    const adGroupsData = plan.adGroups.flatMap(adGroup =>
      adGroup.keywords.map(keyword => ({
        adGroupName: adGroup.name,
        keyword: keyword.keyword,
        searchVolume: keyword.searchVolume,
        suggestedCPC: adGroup.suggestedCPC,
        matchTypes: adGroup.matchTypes.join('; '),
        competition: keyword.competition,
        intent: keyword.intent
      }))
    );
    exportToCSV(adGroupsData, `ad-groups-${plan.id}.csv`);
  };

  const exportSearchThemes = () => {
    const themesData = plan.searchThemes.map(theme => ({
      name: theme.name,
      description: theme.description,
      keywords: theme.keywords.join('; '),
      suggestedBid: theme.suggestedBid
    }));
    exportToCSV(themesData, `search-themes-${plan.id}.csv`);
  };

  const exportShoppingBids = () => {
    const bidsData = plan.shoppingBids.map(bid => ({
      productCategory: bid.productCategory,
      suggestedCPC: bid.suggestedCPC,
      priority: bid.priority,
      expectedConversions: bid.expectedConversions
    }));
    exportToCSV(bidsData, `shopping-bids-${plan.id}.csv`);
  };

  const exportFullReport = () => {
    const reportData = [{
      planId: plan.id,
      brandWebsite: plan.inputs.brandWebsite,
      competitorWebsite: plan.inputs.competitorWebsite,
      serviceLocations: plan.inputs.serviceLocations.join('; '),
      shoppingBudget: plan.inputs.budgets.shopping,
      searchBudget: plan.inputs.budgets.search,
      pmaxBudget: plan.inputs.budgets.pmax,
      totalBudget: plan.totalEstimatedCost,
      expectedConversions: plan.expectedConversions,
      totalKeywords: plan.keywords.length,
      adGroups: plan.adGroups.length,
      searchThemes: plan.searchThemes.length,
      createdAt: plan.createdAt
    }];
    exportToCSV(reportData, `sem-plan-report-${plan.id}.csv`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={exportKeywords}>
          <Table className="h-4 w-4 mr-2" />
          Keywords CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAdGroups}>
          <Table className="h-4 w-4 mr-2" />
          Ad Groups CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportSearchThemes}>
          <Table className="h-4 w-4 mr-2" />
          Search Themes CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportShoppingBids}>
          <Table className="h-4 w-4 mr-2" />
          Shopping Bids CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportFullReport}>
          <FileText className="h-4 w-4 mr-2" />
          Full Report CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
