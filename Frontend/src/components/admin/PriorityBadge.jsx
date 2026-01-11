/**
 * Priority Badge Component
 * 
 * Displays priority level with color-coding and icons
 * Used in request lists, dashboards, and detailed views
 * 
 * Props:
 * - score: Priority score (0-255)
 * - category: Priority category (CRITICAL, HIGH, MEDIUM, LOW)
 * - showScore: Whether to show numeric score (default: true)
 * - size: Size variant (small, medium, large) - default: medium
 * - clickable: Whether badge is clickable/interactive (default: false)
 * - onClick: Callback when clicked
 */

import React from 'react';
import PropTypes from 'prop-types';

const PriorityBadge = ({
  score = 50,
  category = 'MEDIUM',
  showScore = true,
  size = 'medium',
  clickable = false,
  onClick = null,
  className = '',
  showLabel = true,
  showIcon = true
}) => {
  // Ensure score is a number
  const safeScore = typeof score === 'object' ? (score?.score || 50) : (score || 50);
  
  // Ensure category is a string
  const safeCategory = typeof category === 'string' ? category : 'MEDIUM';
  
  // Color and icon mapping for each priority level - Website Theme
  const priorityConfig = {
    CRITICAL: {
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-100',
      textColor: 'text-red-900',
      borderColor: 'border-red-300',
      icon: '🔴',
      emoji: '⚠️',
      label: 'Critical',
      pulse: 'animate-pulse',
      badge: 'badge-critical'
    },
    HIGH: {
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
      textColor: 'text-orange-900',
      borderColor: 'border-orange-300',
      icon: '🟠',
      emoji: '🔥',
      label: 'High',
      pulse: '',
      badge: 'badge-high'
    },
    MEDIUM: {
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      textColor: 'text-yellow-900',
      borderColor: 'border-yellow-300',
      icon: '🟡',
      emoji: '⏳',
      label: 'Medium',
      pulse: '',
      badge: 'badge-medium'
    },
    LOW: {
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      textColor: 'text-green-900',
      borderColor: 'border-green-300',
      icon: '🟢',
      emoji: '✅',
      label: 'Low',
      pulse: '',
      badge: 'badge-low'
    }
  };

  // Size configuration
  const sizeConfig = {
    small: {
      padding: 'px-2.5 py-1',
      fontSize: 'text-xs',
      icon: 'text-sm'
    },
    medium: {
      padding: 'px-3 py-1.5',
      fontSize: 'text-sm',
      icon: 'text-base'
    },
    large: {
      padding: 'px-4 py-2',
      fontSize: 'text-base',
      icon: 'text-lg'
    }
  };

  const config = priorityConfig[safeCategory] || priorityConfig.MEDIUM;
  const sizeClass = sizeConfig[size] || sizeConfig.medium;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        rounded-full border-2
        ${sizeClass.padding}
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        font-bold
        ${sizeClass.fontSize}
        ${clickable ? 'cursor-pointer hover:shadow-lg transition-all hover:scale-105' : ''}
        ${config.pulse}
        shadow-sm
        ${className}
      `}
      onClick={onClick}
      role={clickable ? 'button' : 'status'}
      aria-label={`Priority: ${safeCategory} - Score: ${safeScore}`}
      title={`Priority Score: ${safeScore}/255`}
    >
      {/* Icon */}
      {showIcon && (
        <span className={sizeClass.icon}>
          {safeCategory === 'CRITICAL' ? config.emoji : config.icon}
        </span>
      )}

      {/* Label */}
      {showLabel && <span>{config.label}</span>}

      {/* Score */}
      {showScore && (
        <span className="text-xs opacity-75 font-semibold">
          ({safeScore})
        </span>
      )}
    </div>
  );
};

PriorityBadge.propTypes = {
  score: PropTypes.number,
  category: PropTypes.oneOf(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  showScore: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  showLabel: PropTypes.bool,
  showIcon: PropTypes.bool
};

export default PriorityBadge;

/**
 * Priority Info Component
 * Shows detailed priority information
 */
export const PriorityInfo = ({ priorityData, compact = false }) => {
  if (!priorityData) {
    return <div className="text-[#7c4a5e]">No priority data</div>;
  }

  const { score, category, breakdown, calculatedAt, actionRequired } = priorityData;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <PriorityBadge score={score} category={category} size="small" />
        <span className="text-xs text-[#8a5c70]">
          {new Date(calculatedAt).toLocaleTimeString()}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/80 bg-white/95 p-5 shadow-[0_25px_60px_rgba(241,122,146,0.18)]">
      {/* Header with badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-100">
        <h3 className="text-lg font-bold text-[#31101e]">Priority Details</h3>
        <PriorityBadge score={score} category={category} size="medium" />
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-[#7c4a5e]">Priority Score</span>
          <span className="text-2xl font-bold text-[#31101e]">{score}/255</span>
        </div>
        <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all shadow-sm ${
              category === 'CRITICAL' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              category === 'HIGH' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              category === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${(score / 255) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 p-4 mb-3">
          <h4 className="text-sm font-bold text-[#31101e] mb-3">Score Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[#7c4a5e]">Urgency:</span>
              <span className="font-bold text-[#ff4d6d]">{breakdown.urgencyScore || 0} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7c4a5e]">Blood Rarity:</span>
              <span className="font-bold text-[#ff4d6d]">{breakdown.rarityScore || 0} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7c4a5e]">Time Factor:</span>
              <span className="font-bold text-[#ff4d6d]">{breakdown.timeScore || 0} pts</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7c4a5e]">Availability:</span>
              <span className="font-bold text-[#ff4d6d]">{breakdown.availabilityScore || 0} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Required */}
      {actionRequired && (
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 p-3 text-sm text-amber-900 font-semibold">
          ⚡ {actionRequired}
        </div>
      )}

      {/* Calculated time */}
      <div className="text-xs text-[#8a5c70] mt-4 pt-3 border-t border-pink-100">
        Calculated: {new Date(calculatedAt).toLocaleString()}
      </div>
    </div>
  );
};

/**
 * Priority Legend Component
 * Shows what each priority level means
 */
export const PriorityLegend = () => {
  const levels = [
    {
      category: 'CRITICAL',
      description: 'Immediate action required',
      responseTime: '< 15 minutes',
      examples: 'Life-threatening conditions, massive bleeding',
      color: '#ef4444'
    },
    {
      category: 'HIGH',
      description: 'Urgent attention needed',
      responseTime: '15-45 minutes',
      examples: 'Severe patient condition, rare blood type in low stock',
      color: '#f97316'
    },
    {
      category: 'MEDIUM',
      description: 'Standard priority',
      responseTime: '45 minutes - 2 hours',
      examples: 'Regular surgical procedures, planned transfusions',
      color: '#eab308'
    },
    {
      category: 'LOW',
      description: 'Can be scheduled',
      responseTime: '2+ hours',
      examples: 'Non-urgent transfusions, sufficient blood available',
      color: '#22c55e'
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-[#31101e] mb-4 pb-2 border-b border-pink-100">
        Priority Levels
      </h3>
      <div className="space-y-3">
        {levels.map(level => (
          <div 
            key={level.category} 
            className="rounded-xl border-l-4 pl-3 py-2 bg-gradient-to-r from-white to-pink-50/30" 
            style={{ borderColor: level.color }}
          >
            <div className="flex items-center gap-2 mb-2">
              <PriorityBadge category={level.category} showScore={false} size="small" />
              <span className="text-sm font-bold text-[#31101e]">{level.description}</span>
            </div>
            <p className="text-xs text-[#7c4a5e] mb-1">
              Response Time: <span className="font-semibold text-[#5c283a]">{level.responseTime}</span>
            </p>
            <p className="text-xs text-[#8a5c70]">
              Examples: {level.examples}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
