import React from 'react';

const Bar = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`${w} ${h} bg-gray-200 rounded animate-pulse`} />
);

const CardSkeleton = ({ rows = 4 }) => (
  <div className="bg-banking-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
    <Bar w="w-1/3" h="h-4" />
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between gap-4">
          <Bar w="w-1/3" h="h-3" />
          <Bar w="w-1/4" h="h-3" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Full-page skeleton shown while the Digital Profile API request is
 * in flight, mirroring the real page's section layout so the page
 * feels like it's loading naturally rather than appearing blank.
 */
const ProfileSkeleton = () => (
  <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
    <p className="text-sm text-text-secondary flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-banking-primary animate-pulse" />
      Preparing your verified financial profile...
    </p>

    {/* Header */}
    <div className="flex justify-between items-center">
      <Bar w="w-48" h="h-7" />
      <Bar w="w-32" h="h-9" />
    </div>

    {/* Banner */}
    <div className="bg-banking-card border border-border rounded-lg p-6 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <Bar w="w-1/3" h="h-5" />
        <Bar w="w-2/3" h="h-3" />
      </div>
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-banking-card border border-border rounded-lg p-6 flex flex-col items-center gap-3">
          <Bar w="w-24" h="h-3" />
          <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
          <Bar w="w-20" h="h-3" />
        </div>
      ))}
    </div>

    {/* Section cards grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <CardSkeleton rows={4} />
      </div>
      <CardSkeleton rows={4} />
    </div>

    <div className="bg-banking-card border border-border rounded-lg p-6">
      <Bar w="w-1/4" h="h-4" />
      <div className="grid grid-cols-5 gap-4 mt-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bar key={i} w="w-full" h="h-8" />
        ))}
      </div>
    </div>

    <div className="rounded-lg bg-gray-200 animate-pulse h-40" />
  </div>
);

export default ProfileSkeleton;
