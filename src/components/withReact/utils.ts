// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper function to get random color class
export function getRandomColorClass(): string {
  const colors = [
    'bg-blue-50 border-blue-200 text-blue-800',
    'bg-green-50 border-green-200 text-green-800',
    'bg-purple-50 border-purple-200 text-purple-800',
    'bg-yellow-50 border-yellow-200 text-yellow-800',
    'bg-red-50 border-red-200 text-red-800'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
