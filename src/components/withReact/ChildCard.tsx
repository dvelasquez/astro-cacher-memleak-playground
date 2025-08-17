import React from 'react';
import type { FixtureType } from '../../data/fixtureType';
import { formatDate, getRandomColorClass } from './utils';

interface Props {
  child: FixtureType;
  index: number;
}

export const ChildCard: React.FC<Props> = ({ child, index }) => {
  return (
    <div className="child-card bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getRandomColorClass()}`}>
            {child.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight break-words">
              {child.name}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                #{child.id}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="text-xs text-gray-500">Created</div>
          <div className="text-xs font-medium text-gray-900">{formatDate(child.createdAt)}</div>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 break-words">
          {child.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">Updated: {formatDate(child.updatedAt)}</span>
        <span className="flex items-center flex-shrink-0 ml-2">
          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          {child.children.length} children
        </span>
      </div>
    </div>
  );
};
