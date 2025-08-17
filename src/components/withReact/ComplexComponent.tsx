import React from 'react';
import type { FixtureType } from '../../data/fixtureType';
import { FixtureHeader } from './FixtureHeader';
import { FixtureDescription } from './FixtureDescription';
import { FixtureMetadata } from './FixtureMetadata';
import { FixtureChildren } from './FixtureChildren';

interface Props {
  fixture: FixtureType;
}

export const ComplexComponent: React.FC<Props> = ({ fixture }) => {
  return (
    <div className="fixture-container max-w-6xl mx-auto p-6 space-y-8 overflow-hidden">
      {/* Main Fixture Header */}
      <FixtureHeader fixture={fixture} />
      
      {/* Main Fixture Description */}
      <FixtureDescription fixture={fixture} />
      
      {/* Main Fixture Metadata */}
      <FixtureMetadata fixture={fixture} />
      
      {/* Children Section */}
      <FixtureChildren children={fixture.children} />
    </div>
  );
};
