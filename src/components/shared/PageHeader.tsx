type PageHeaderProps = {
  icon: string;
  title: string;
  iconClass?: string;
};

const PageHeader = ({ icon, title, iconClass = "invert-white" }: PageHeaderProps) => (
  <div className="flex gap-2 w-full max-w-5xl">
    <img
      src={icon}
      width={36}
      height={36}
      alt=""
      className={iconClass}
      aria-hidden="true"
    />
    <h1 className="h3-bold md:h2-bold text-left w-full">{title}</h1>
  </div>
);

export default PageHeader;
