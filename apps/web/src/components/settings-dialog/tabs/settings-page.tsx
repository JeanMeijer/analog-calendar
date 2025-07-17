interface SettingsPageProps {
  children: React.ReactNode;
}

export function SettingsPage({ children }: SettingsPageProps) {
  return <div className="flex flex-col gap-y-8 p-3">{children}</div>;
}

interface SettingsSectionHeaderProps {
  children: React.ReactNode;
}
export function SettingsSectionHeader({
  children,
}: SettingsSectionHeaderProps) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

interface SettingsSectionTitleProps extends React.ComponentProps<"h3"> {
  children: React.ReactNode;
}

export function SettingsSectionTitle({
  children,
  ...props
}: SettingsSectionTitleProps) {
  return (
    <h3 className="text-sm font-medium" {...props}>
      {children}
    </h3>
  );
}

interface SettingsSectionDescriptionProps extends React.ComponentProps<"p"> {
  children: React.ReactNode;
}

export function SettingsSectionDescription({
  children,
  ...props
}: SettingsSectionDescriptionProps) {
  return (
    <p className="text-sm text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

interface SettingsSectionProps {
  children: React.ReactNode;
}

export function SettingsSection({ children }: SettingsSectionProps) {
  return <div className="flex flex-col gap-y-6">{children}</div>;
}

interface SettingsSectionContentProps {
  children: React.ReactNode;
}

export function SettingsSectionContent({
  children,
}: SettingsSectionContentProps) {
  return <div className="flex flex-col gap-6 px-3">{children}</div>;
}
