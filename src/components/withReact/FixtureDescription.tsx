import React from 'react';
import type { FixtureType } from '../../data/fixtureType';
import { getRandomColorClass } from './utils';

interface Props {
  fixture: FixtureType;
}

export const FixtureDescription: React.FC<Props> = ({ fixture }) => {
  return (
    <div className="fixture-description bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">Description</h2>
      </div>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed text-lg break-words">
          {fixture.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {fixture.description.split(' ').slice(0, 8).map((word, index) => (
            <span key={index} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium break-words max-w-full ${getRandomColorClass()}`}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
