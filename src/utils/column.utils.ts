/**
 * Reorders tasks after drag and drop within the same column
 */
export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Checks if a column has reached its WIP limit
 */
export const isWipLimitReached = (currentCount: number, maxTasks?: number): boolean => {
  if (!maxTasks) return false;
  return currentCount >= maxTasks;
};

/**
 * Gets WIP limit warning level
 */
export const getWipWarningLevel = (currentCount: number, maxTasks?: number): 'none' | 'warning' | 'error' => {
  if (!maxTasks) return 'none';
  if (currentCount >= maxTasks) return 'error';
  if (currentCount >= maxTasks * 0.8) return 'warning';
  return 'none';
};


