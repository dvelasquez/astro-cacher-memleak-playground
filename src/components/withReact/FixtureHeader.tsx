import React from 'react';
import type { FixtureType } from '../../data/fixtureType';
import { formatDate } from './utils';

interface Props {
  fixture: FixtureType;
}

export const FixtureHeader: React.FC<Props> = ({ fixture }) => {
  return (
    <div className="fixture-header bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 min-w-0 flex-1">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {fixture.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight break-words">
              {fixture.name}
            </h1>
            <div className="flex items-center space-x-2 mt-1 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ID: {fixture.id}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="text-sm text-gray-500">Created</div>
          <div className="text-lg font-semibold text-gray-900">{formatDate(fixture.createdAt)}</div>
        </div>
      </div>
    </div>
  );
};
