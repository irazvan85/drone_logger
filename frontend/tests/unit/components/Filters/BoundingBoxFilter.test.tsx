import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BoundingBoxFilter } from '../../../../src/components/Filters/BoundingBoxFilter';
import React from 'react';

describe('BoundingBoxFilter', () => {
  it('renders draw button', () => {
    render(
      <BoundingBoxFilter
        bounds={null}
        isDrawing={false}
        onToggleDrawing={() => {}}
        onClearBounds={() => {}}
      />
    );
    
    expect(screen.getByText('Draw Bounding Box')).toBeInTheDocument();
  });

  it('toggles drawing state', () => {
    const onToggle = vi.fn();
    
    render(
      <BoundingBoxFilter
        bounds={null}
        isDrawing={false}
        onToggleDrawing={onToggle}
        onClearBounds={() => {}}
      />
    );
    
    fireEvent.click(screen.getByText('Draw Bounding Box'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows bounds and clear button when bounds exist', () => {
    const onClear = vi.fn();
    const bounds = { north: 45, south: 44, east: -122, west: -123 };
    
    render(
      <BoundingBoxFilter
        bounds={bounds}
        isDrawing={false}
        onToggleDrawing={() => {}}
        onClearBounds={onClear}
      />
    );
    
    expect(screen.getByText(/Selected Area/)).toBeInTheDocument();
    expect(screen.getByText('Clear Selection')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Clear Selection'));
    expect(onClear).toHaveBeenCalled();
  });
});
