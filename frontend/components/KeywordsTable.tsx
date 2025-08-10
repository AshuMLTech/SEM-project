import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { KeywordData } from '~backend/sem/types';

interface KeywordsTableProps {
  keywords: KeywordData[];
}

export function KeywordsTable({ keywords }: KeywordsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [competitionFilter, setCompetitionFilter] = useState<string>('all');

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntent = intentFilter === 'all' || keyword.intent === intentFilter;
    const matchesCompetition = competitionFilter === 'all' || keyword.competition === competitionFilter;
    
    return matchesSearch && matchesIntent && matchesCompetition;
  });

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'BRAND': return 'bg-blue-100 text-blue-800';
      case 'CATEGORY': return 'bg-green-100 text-green-800';
      case 'COMPETITOR': return 'bg-red-100 text-red-800';
      case 'LOCATION': return 'bg-purple-100 text-purple-800';
      case 'LONG_TAIL': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={intentFilter} onValueChange={setIntentFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by intent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intents</SelectItem>
            <SelectItem value="BRAND">Brand</SelectItem>
            <SelectItem value="CATEGORY">Category</SelectItem>
            <SelectItem value="COMPETITOR">Competitor</SelectItem>
            <SelectItem value="LOCATION">Location</SelectItem>
            <SelectItem value="LONG_TAIL">Long Tail</SelectItem>
          </SelectContent>
        </Select>
        <Select value={competitionFilter} onValueChange={setCompetitionFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by competition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Competition</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600">
        Showing {filteredKeywords.length} of {keywords.length} keywords
      </p>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Keyword</TableHead>
              <TableHead className="font-semibold">Search Volume</TableHead>
              <TableHead className="font-semibold">Bid Range</TableHead>
              <TableHead className="font-semibold">Competition</TableHead>
              <TableHead className="font-semibold">Intent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeywords.map((keyword, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{keyword.keyword}</TableCell>
                <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                <TableCell>
                  ${keyword.topOfPageBidLow.toFixed(2)} - ${keyword.topOfPageBidHigh.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={getCompetitionColor(keyword.competition)}>
                    {keyword.competition}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getIntentColor(keyword.intent)}>
                    {keyword.intent.replace('_', ' ')}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
