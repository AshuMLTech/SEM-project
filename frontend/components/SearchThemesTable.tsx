import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { SearchTheme } from '~backend/sem/types';

interface SearchThemesTableProps {
  themes: SearchTheme[];
}

export function SearchThemesTable({ themes }: SearchThemesTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Theme Name</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Keywords</TableHead>
            <TableHead className="font-semibold">Suggested Bid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {themes.map((theme, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">{theme.name}</TableCell>
              <TableCell className="text-sm text-gray-600">{theme.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-md">
                  {theme.keywords.slice(0, 5).map((keyword, keywordIndex) => (
                    <Badge key={keywordIndex} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {theme.keywords.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{theme.keywords.length - 5} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                ${theme.suggestedBid.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
