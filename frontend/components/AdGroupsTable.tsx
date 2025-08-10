import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AdGroup } from '~backend/sem/types';

interface AdGroupsTableProps {
  adGroups: AdGroup[];
}

export function AdGroupsTable({ adGroups }: AdGroupsTableProps) {
  const [openGroups, setOpenGroups] = React.useState<Set<string>>(new Set());

  const toggleGroup = (groupName: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupName)) {
      newOpenGroups.delete(groupName);
    } else {
      newOpenGroups.add(groupName);
    }
    setOpenGroups(newOpenGroups);
  };

  return (
    <div className="space-y-4">
      {adGroups.map((adGroup) => (
        <div key={adGroup.name} className="border rounded-lg overflow-hidden">
          <Collapsible
            open={openGroups.has(adGroup.name)}
            onOpenChange={() => toggleGroup(adGroup.name)}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  {openGroups.has(adGroup.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <h3 className="font-semibold text-left">{adGroup.name}</h3>
                  <Badge variant="secondary">
                    {adGroup.keywords.length} keywords
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Suggested CPC: ${adGroup.suggestedCPC.toFixed(2)}</span>
                  <div className="flex space-x-1">
                    {adGroup.matchTypes.map((matchType) => (
                      <Badge key={matchType} variant="outline" className="text-xs">
                        {matchType}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Search Volume</TableHead>
                    <TableHead>Bid Range</TableHead>
                    <TableHead>Competition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adGroup.keywords.map((keyword, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                      <TableCell>
                        ${keyword.topOfPageBidLow.toFixed(2)} - ${keyword.topOfPageBidHigh.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            keyword.competition === 'LOW' ? 'bg-green-100 text-green-800' :
                            keyword.competition === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {keyword.competition}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
}
