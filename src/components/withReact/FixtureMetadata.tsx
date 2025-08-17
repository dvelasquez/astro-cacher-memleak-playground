import React from 'react';
import type { FixtureType } from '../../data/fixtureType';
import { formatDate } from './utils';

interface Props {
  fixture: FixtureType;
}

export const FixtureMetadata: React.FC<Props> = ({ fixture }) => {
  return (
    <div className="fixture-metadata bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metadata-item">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">Created At</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{formatDate(fixture.createdAt)}</div>
        </div>
        
        <div className="metadata-item">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">Updated At</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{formatDate(fixture.updatedAt)}</div>
        </div>
        
        <div className="metadata-item">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">Children Count</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">{fixture.children.length}</div>
        </div>
      </div>
    </div>
  );
};
