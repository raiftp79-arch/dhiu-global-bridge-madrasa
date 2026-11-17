import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  MapPin,
  X,
} from 'lucide-react';
import type {
  Course,
  MentorProfile,
  PlatformEvent,
  ResourceArticle,
} from '../../types';

export function BrandMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="6.5"
        y="6.5"
        width="19"
        height="19"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="6.5"
        y="6.5"
        width="19"
        height="19"
        rx="2.5"
        transform="rotate(45 16 16)"
        stroke="#C5A46D"
        strokeWidth="1.4"
      />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164B3B] active:scale-[0.99]';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-[#164B3B] text-[#FFFFFF] hover:bg-[#10382F]',
    secondary: 'bg-[#E8F0E8] text-[#10382F] hover:bg-[#d8e6d8]',
    outline:
      'bg-[#FFFFFF] text-[#202B27] border border-[#202B27]/15 hover:border-[#164B3B]/45 hover:bg-[#FAF9F4]',
    ghost: 'bg-transparent text-[#202B27] hover:bg-[#E8F0E8]/60',
    gold: 'bg-[#C5A46D] text-[#10382F] hover:bg-[#b8955d]',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-3.5 py-2 text-xs min-h-[36px]',
    md: 'px-5 py-2.5 text-sm min-h-[42px]',
    lg: 'px-6 py-3.5 text-sm min-h-[48px]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F0E8] via-[#FAF9F4] to-[#A8BDA9]/30 text-[#164B3B] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BrandMark className="w-10 h-10 mb-2 opacity-75" />
        {fallbackTitle && (
          <p className="text-xs font-medium text-[#202B27]/75 max-w-[180px]">
            {fallbackTitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between text-xs text-[#6D7972] mb-1.5">
          <span>{label}</span>
          <span className="tabular-nums font-medium text-[#164B3B]">{clamped}%</span>
        </div>
      )}
      <div
        className="w-full h-1.5 bg-[#E8F0E8] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[#164B3B] rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10382F]/35 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#202B27]/12 p-6 md:p-8 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#202B27]/10">
          <h3 className="text-lg font-semibold text-[#202B27]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-lg text-[#6D7972] hover:text-[#202B27] hover:bg-[#FAF9F4] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-8 text-center">
      <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-[#E8F0E8] text-[#164B3B] flex items-center justify-center">
        <BookOpen className="w-5 h-5" />
      </div>
      <h4 className="text-base font-semibold text-[#202B27] mb-1.5">{title}</h4>
      <p className="text-sm text-[#6D7972] max-w-md mx-auto mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-[#E8F0E8]/70" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-28 bg-[#E8F0E8] rounded" />
        <div className="h-5 w-3/4 bg-[#E8F0E8] rounded" />
        <div className="h-4 w-full bg-[#FAF9F4] rounded" />
      </div>
    </div>
  );
}

export function CourseCard({
  course,
  completedCount,
  enrolled,
  onOpen,
}: {
  course: Course;
  completedCount?: number;
  enrolled?: boolean;
  onOpen: () => void;
}) {
  const totalLessons = course.lessons.length;
  const pct =
    enrolled && totalLessons > 0
      ? Math.round(((completedCount ?? 0) / totalLessons) * 100)
      : null;

  return (
    <article
      onClick={onOpen}
      className="group rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[#164B3B]/35"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#E8F0E8]">
        <SafeImage
          src={course.thumbnail}
          alt={course.title}
          fallbackTitle={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-xs font-medium text-[#6D7972] mb-2 tabular-nums">
          <span>{course.category}</span>
          <span aria-hidden="true"> · </span>
          <span>{course.level}</span>
          <span aria-hidden="true"> · </span>
          <span>{course.language}</span>
          <span aria-hidden="true"> · </span>
          <span>{totalLessons} lessons</span>
        </div>

        <h3 className="text-lg font-semibold text-[#202B27] mb-2 group-hover:text-[#164B3B] transition-colors">
          {course.title}
        </h3>

        <p className="text-sm text-[#6D7972] leading-relaxed mb-5 flex-1">
          {course.description}
        </p>

        {pct !== null ? (
          <div className="pt-3 border-t border-[#202B27]/8">
            <ProgressBar
              value={pct}
              label={`${completedCount ?? 0} of ${totalLessons} completed`}
            />
          </div>
        ) : (
          <div className="pt-3 border-t border-[#202B27]/8 flex items-center justify-between text-sm font-medium text-[#164B3B]">
            <span>Open Course</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </article>
  );
}

export function ResourceCard({
  resource,
  saved,
  onToggleSave,
  onRead,
}: {
  resource: ResourceArticle;
  saved: boolean;
  onToggleSave: () => void;
  onRead: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#164B3B]/30">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-xs font-medium text-[#6D7972]">
            {resource.topic} · {resource.readTime}
          </p>
          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? 'Remove from saved resources' : 'Save resource'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              saved
                ? 'bg-[#E8F0E8] text-[#164B3B]'
                : 'text-[#6D7972] hover:text-[#164B3B] hover:bg-[#FAF9F4]'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-[#202B27]">{resource.title}</h3>
          {resource.arabicTerm && (
            <span className="text-sm font-medium text-[#C5A46D] shrink-0" dir="rtl">
              {resource.arabicTerm}
            </span>
          )}
        </div>

        <p className="text-sm text-[#6D7972] leading-relaxed mb-5">{resource.summary}</p>
      </div>

      <button
        type="button"
        onClick={onRead}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#164B3B] hover:text-[#10382F] cursor-pointer whitespace-nowrap self-start"
      >
        <span>Read guide</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </article>
  );
}

export function MentorCard({
  mentor,
  onRequest,
}: {
  mentor: MentorProfile;
  onRequest: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 flex flex-col justify-between transition-all duration-200 hover:border-[#164B3B]/35">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-[#202B27]">{mentor.name}</h3>
            <p className="text-xs text-[#6D7972] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#164B3B]" />
              <span>
                {mentor.city}, {mentor.country}
              </span>
            </p>
          </div>
          <span className="text-xs font-medium text-[#164B3B] shrink-0">
            {mentor.availabilityStatus}
          </span>
        </div>

        <p className="text-xs text-[#6D7972] mb-3">
          Languages: {mentor.languages.join(' · ')}
        </p>

        <p className="text-sm text-[#202B27]/85 leading-relaxed mb-4">{mentor.bio}</p>

        <p className="text-xs text-[#6D7972] pt-3 border-t border-[#202B27]/8 mb-5">
          Focus: {mentor.specialties.join(' · ')}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-xs text-[#6D7972] tabular-nums">{mentor.weeklyHours}</span>
        <Button size="sm" onClick={onRequest}>
          Request Guidance
        </Button>
      </div>
    </article>
  );
}

export function EventCard({
  event,
  registered,
  onToggleRegister,
}: {
  event: PlatformEvent;
  registered: boolean;
  onToggleRegister: () => void;
}) {
  const spotsLeft = Math.max(0, event.capacity - event.registeredUserIds.length);
  return (
    <article className="rounded-2xl border border-[#202B27]/10 bg-[#FFFFFF] p-6 flex flex-col justify-between">
      <div>
        <div className="text-xs font-medium text-[#6D7972] mb-2 tabular-nums">
          <span>{event.category}</span>
          <span aria-hidden="true"> · </span>
          <span>{event.format}</span>
          <span aria-hidden="true"> · </span>
          <span>{event.language}</span>
        </div>
        <h3 className="text-base font-semibold text-[#202B27] mb-2">{event.title}</h3>
        <p className="text-sm text-[#6D7972] leading-relaxed mb-4">{event.description}</p>
        <div className="space-y-1 text-xs text-[#6D7972] mb-5 tabular-nums">
          <p className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#164B3B]" />
            <span>
              {event.dateISO} · {event.timeDisplay}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#164B3B]" />
            <span>
              {event.cityCountry} · Host: {event.hostName}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#202B27]/8">
        <span className="text-xs text-[#6D7972] tabular-nums">{spotsLeft} seats open</span>
        <Button
          size="sm"
          variant={registered ? 'secondary' : 'primary'}
          onClick={onToggleRegister}
        >
          {registered ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Registered</span>
            </>
          ) : (
            <span>Register</span>
          )}
        </Button>
      </div>
    </article>
  );
}
