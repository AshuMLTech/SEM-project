import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ShoppingBid } from '~backend/sem/types';

interface ShoppingBidsTableProps {
  bids: ShoppingBid[];
}

export function ShoppingBidsTable({ bids }: ShoppingBidsTableProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Product Category</TableHead>
            <TableHead className="font-semibold">Suggested CPC</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Expected Conversions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium">{bid.productCategory}</TableCell>
              <TableCell className="font-medium">${bid.suggestedCPC.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={getPriorityColor(bid.priority)}>
                  {bid.priority}
                </Badge>
              </TableCell>
              <TableCell>{bid.expectedConversions.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
