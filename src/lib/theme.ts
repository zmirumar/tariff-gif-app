export type AppTheme = {
  colors: {
    bgBody: string;
    bgSurface: string;
    bgSurfaceAlt: string;
    bgSoft: string;
    borderSubtle: string;
    borderStrong: string;
    shadowSoft: string;
    shadowLg: string;

    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    primary: string;
    primaryHover: string;
    primarySoftBg: string;
    primarySoftText: string;

    tertiary: string;
    tertiarySoftBg: string;

    danger: string;
    dangerSoftBg: string;
    dangerSoftBorder: string;
  };
};

const baseColors = {
  primary: "#3B82F6",
  primaryHover: "#2563EB",
  tertiary: "#10B981",
  danger: "#EF4444",
} as const;

export const lightTheme: AppTheme = {
  colors: {
    bgBody: "#FAFAFA",
    bgSurface: "#FFFFFF",
    bgSurfaceAlt: "#F8F9FA",
    bgSoft: "#F5F5F5",
    borderSubtle: "#F0F0F0",
    borderStrong: "#D9D9D9",
    shadowSoft: "0 4px 12px rgba(0, 0, 0, 0.04)",
    shadowLg: "0 20px 40px rgba(0, 0, 0, 0.08)",

    textPrimary: "#1D1D1F",
    textSecondary: "#595959",
    textMuted: "#8C8C8C",

    primary: baseColors.primary,
    primaryHover: baseColors.primaryHover,
    primarySoftBg: "#E6F4FF",
    primarySoftText: "#1677FF",

    tertiary: baseColors.tertiary,
    tertiarySoftBg: "rgba(16, 185, 129, 0.12)",

    danger: baseColors.danger,
    dangerSoftBg: "#FFF1F0",
    dangerSoftBorder: "#FFCCC7",
  },
};

export const darkTheme: AppTheme = {
  colors: {
    bgBody: "#020617",
    bgSurface: "#02081F",
    bgSurfaceAlt: "#0B1220",
    bgSoft: "#02081F",
    borderSubtle: "rgba(148, 163, 184, 0.25)",
    borderStrong: "rgba(148, 163, 184, 0.45)",
    shadowSoft: "0 18px 45px rgba(15, 23, 42, 0.8)",
    shadowLg: "0 25px 60px rgba(2, 6, 23, 0.9)",

    textPrimary: "#E5E7EB",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",

    primary: baseColors.primary,
    primaryHover: baseColors.primaryHover,
    primarySoftBg: "rgba(59, 130, 246, 0.16)",
    primarySoftText: "#BFDBFE",

    tertiary: baseColors.tertiary,
    tertiarySoftBg: "rgba(16, 185, 129, 0.16)",

    danger: baseColors.danger,
    dangerSoftBg: "rgba(239, 68, 68, 0.16)",
    dangerSoftBorder: "rgba(248, 113, 113, 0.5)",
  },
};

