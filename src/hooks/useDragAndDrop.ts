import { useState, useCallback, useRef } from 'react';
import { DragState } from '@/components/KanbanBoard/KanbanBoard.types';

/**
 * Custom hook for managing drag and drop state
 * Uses native HTML5 drag API - no external libraries
 */
export const useDragAndDrop = () => {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    draggedFromColumn: null,
    draggedIndex: null,
    dropTargetId: null,
    dropIndex: null,
  });
  
  // Keep reference to drag image for cleanup
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  
  const handleDragStart = useCallback((id: string, columnId: string, index: number, e: React.DragEvent) => {
    setState({
      isDragging: true,
      draggedId: id,
      draggedFromColumn: columnId,
      draggedIndex: index,
      dropTargetId: null,
      dropIndex: null,
    });
    
    // Create custom drag preview image
    // This gives us better control over how the dragged item looks
    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px'; // Hide off-screen
    dragImage.style.width = '280px';
    dragImage.style.padding = '12px';
    dragImage.style.backgroundColor = 'white';
    dragImage.style.border = '1px solid #e4e4e7';
    dragImage.style.borderRadius = '8px';
    dragImage.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    dragImageRef.current = dragImage;
    
    // Configure drag operation
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    
    // Set custom drag image if supported
    // Some browsers might not support this, so we check first
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(dragImage, 140, 20);
    }
  }, []);
  
  const handleDragOver = useCallback((targetId: string, index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setState(prev => ({
      ...prev,
      dropTargetId: targetId,
      dropIndex: index,
    }));
  }, []);
  
  const handleDragEnd = useCallback(() => {
    // Clean up drag image element
    // Sometimes the element might already be removed, so we wrap in try-catch
    if (dragImageRef.current && dragImageRef.current.parentNode) {
      try {
        document.body.removeChild(dragImageRef.current);
      } catch (e) {
        // Element may have already been removed by browser
        // This is fine, just continue
      }
      dragImageRef.current = null;
    }
    
    setState({
      isDragging: false,
      draggedId: null,
      draggedFromColumn: null,
      draggedIndex: null,
      dropTargetId: null,
      dropIndex: null,
    });
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  return {
    ...state,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  };
};

