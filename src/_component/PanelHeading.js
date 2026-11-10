export default function PanelHeading({ title, actions, as: Title = "h4", id, className = "", titleClassName = "", titleProps = {} }) {
	return (
		<div className={`panel-heading ${className}`.trim()}>
			<Title {...titleProps} className={`panel-heading-title ${titleClassName}`.trim()} id={id}>{title}</Title>
			{actions && <div className="panel-heading-actions">{actions}</div>}
		</div>
	);
}
