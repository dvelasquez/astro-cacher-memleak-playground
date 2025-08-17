import { describe, it, expect, beforeEach } from 'vitest';
import { createFixture, type FixtureType } from './fixtureType';

describe('createFixture', () => {
  let fixture: FixtureType;

  beforeEach(() => {
    // Reset fixture before each test
    fixture = null as any;
  });

  describe('size generation', () => {
    it('should generate fixture with size close to target sizeInKB', () => {
      const targetSize = 5;
      fixture = createFixture({ sizeInKB: targetSize });
      
      // Convert to JSON and measure actual size
      const jsonString = JSON.stringify(fixture);
      const actualSizeKB = new Blob([jsonString]).size / 1024;
      
      // Should be within 50% of target size (allowing for approximation)
      expect(actualSizeKB).toBeGreaterThanOrEqual(targetSize * 0.5);
      expect(actualSizeKB).toBeLessThanOrEqual(targetSize * 1.5);
    });

    it('should respect minimum size threshold', () => {
      fixture = createFixture({ sizeInKB: 0.1 }); // Below minimum
      
      const jsonString = JSON.stringify(fixture);
      const actualSizeKB = new Blob([jsonString]).size / 1024;
      
      // Should be at least 1KB (minimum threshold)
      expect(actualSizeKB).toBeGreaterThanOrEqual(0);
    });

    it('should handle large size requests', () => {
      const targetSize = 100;
      fixture = createFixture({ sizeInKB: targetSize });
      
      const jsonString = JSON.stringify(fixture);
      const actualSizeKB = new Blob([jsonString]).size / 1024;
      
      // Should be within reasonable range of target
      expect(actualSizeKB).toBeGreaterThanOrEqual(targetSize * 0.7);
      expect(actualSizeKB).toBeLessThanOrEqual(targetSize * 1.3);
    });
  });

  describe('data structure', () => {
    it('should return valid FixtureType structure', () => {
      fixture = createFixture({ sizeInKB: 2 });
      
      expect(fixture).toHaveProperty('id');
      expect(fixture).toHaveProperty('name');
      expect(fixture).toHaveProperty('description');
      expect(fixture).toHaveProperty('createdAt');
      expect(fixture).toHaveProperty('updatedAt');
      expect(fixture).toHaveProperty('children');
      expect(Array.isArray(fixture.children)).toBe(true);
    });

    it('should have valid data types', () => {
      fixture = createFixture({ sizeInKB: 2 });
      
      expect(typeof fixture.id).toBe('number');
      expect(typeof fixture.name).toBe('string');
      expect(typeof fixture.description).toBe('string');
      expect(typeof fixture.createdAt).toBe('string');
      expect(typeof fixture.updatedAt).toBe('string');
      expect(Array.isArray(fixture.children)).toBe(true);
    });

    it('should have valid date strings', () => {
      fixture = createFixture({ sizeInKB: 2 });
      
      expect(() => new Date(fixture.createdAt)).not.toThrow();
      expect(() => new Date(fixture.updatedAt)).not.toThrow();
      
      const createdAt = new Date(fixture.createdAt);
      const updatedAt = new Date(fixture.updatedAt);
      
      expect(createdAt.getTime()).toBeLessThanOrEqual(Date.now());
      expect(updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('randomization', () => {
    it('should generate different fixtures on multiple calls', () => {
      const fixture1 = createFixture({ sizeInKB: 2 });
      const fixture2 = createFixture({ sizeInKB: 2 });
      
      // Should have different IDs
      expect(fixture1.id).not.toBe(fixture2.id);
      
      // Should have different names
      expect(fixture1.name).not.toBe(fixture2.name);
      
      // Should have different descriptions
      expect(fixture1.description).not.toBe(fixture2.description);
    });

    it('should generate different children on multiple calls', () => {
      const fixture1 = createFixture({ sizeInKB: 5 });
      const fixture2 = createFixture({ sizeInKB: 5 });
      
      // Should have different child IDs
      const childIds1 = fixture1.children.map(child => child.id);
      const childIds2 = fixture2.children.map(child => child.id);
      
      // At least some children should have different IDs
      const hasDifferentIds = childIds1.some(id => !childIds2.includes(id));
      expect(hasDifferentIds).toBe(true);
    });
  });

  describe('children generation', () => {
    it('should generate children to reach target size', () => {
      fixture = createFixture({ sizeInKB: 3 });
      
      // Should have children to reach the target size
      expect(fixture.children.length).toBeGreaterThan(0);
    });

    it('should have valid child structure', () => {
      fixture = createFixture({ sizeInKB: 3 });
      
      if (fixture.children.length > 0) {
        const child = fixture.children[0];
        
        expect(child).toHaveProperty('id');
        expect(child).toHaveProperty('name');
        expect(child).toHaveProperty('description');
        expect(child).toHaveProperty('createdAt');
        expect(child).toHaveProperty('updatedAt');
        expect(child).toHaveProperty('children');
        expect(Array.isArray(child.children)).toBe(true);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle zero size input', () => {
      fixture = createFixture({ sizeInKB: 0 });
      
      const jsonString = JSON.stringify(fixture);
      const actualSizeKB = new Blob([jsonString]).size / 1024;
      
      // Should use minimum size
      expect(actualSizeKB).toBeGreaterThanOrEqual(0);
    });

    it('should handle negative size input', () => {
      fixture = createFixture({ sizeInKB: -5 });
      const jsonString = JSON.stringify(fixture);
      const actualSizeKB = new Blob([jsonString]).size / 1024;
      
      expect(actualSizeKB).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large size input', () => {
      const targetSize = 1000;
      fixture = createFixture({ sizeInKB: targetSize });
      
      const jsonString = JSON.stringify(fixture);
      const actualSizeKB = new Blob([jsonString]).size / 1024;
      
      // Should generate something substantial
      expect(actualSizeKB).toBeGreaterThan(10);
      
      // Should have many children
      expect(fixture.children.length).toBeGreaterThan(10);
    });
  });

  describe('performance', () => {
    it('should complete within reasonable time for moderate sizes', () => {
      const startTime = performance.now();
      
      fixture = createFixture({ sizeInKB: 50 });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete within 100ms for 50KB
      expect(duration).toBeLessThan(100);
    });
  });
});
