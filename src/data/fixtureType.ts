export interface FixtureType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  children: FixtureType[];
}

// Helper function to generate random string of specified length
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to estimate JSON size in KB
function estimateSizeInKB(obj: any): number {
  const jsonString = JSON.stringify(obj);
  return new Blob([jsonString]).size / 1024;
}

export const createFixture = ({sizeInKB}: {sizeInKB: number}): FixtureType => {
  const MIN_SIZE_KB = 1; // Minimum size threshold
  const targetSize = Math.max(sizeInKB, MIN_SIZE_KB);
  
  // Generate base fixture with some initial content
  let fixture: FixtureType = {
    id: Math.floor(Math.random() * 1000000),
    name: generateRandomString(20 + Math.floor(Math.random() * 30)),
    description: generateRandomString(50 + Math.floor(Math.random() * 100)),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
  };

  // Add children to reach target size
  let currentSize = estimateSizeInKB(fixture);
  let childIndex = 0;
  
  while (currentSize < targetSize * 0.9) { // Target 90% of desired size to avoid overshooting
    const child: FixtureType = {
      id: Math.floor(Math.random() * 1000000),
      name: generateRandomString(15 + Math.floor(Math.random() * 25)),
      description: generateRandomString(40 + Math.floor(Math.random() * 80)),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      children: [],
    };
    
    fixture.children.push(child);
    currentSize = estimateSizeInKB(fixture);
    childIndex++;
    
    // Prevent infinite loops with a reasonable limit
    if (childIndex > 1000) break;
  }

  return fixture;
};