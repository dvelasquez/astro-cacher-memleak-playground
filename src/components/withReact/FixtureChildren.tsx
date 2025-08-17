import React from 'react';
import type { FixtureType } from '../../data/fixtureType';
import { ChildCard } from './ChildCard';

interface Props {
  children: FixtureType[];
}

export const FixtureChildren: React.FC<Props> = ({ children }) => {
  return (
    <div className="fixture-children bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">Child Items</h2>
        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {children.length} items
        </span>
      </div>
      
      {children.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
          {children.map((child, index) => (
            <div key={child.id} className="min-w-0">
              <ChildCard child={child} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No children</h3>
          <p className="mt-1 text-sm text-gray-500">This fixture has no child items.</p>
        </div>
      )}
    </div>
  );
};
