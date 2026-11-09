"use client";

import { useId } from "react";

export function Field({ label, required = false, className = "", id: providedId, ...props }) {
  const generatedId = useId();
  const id = providedId || generatedId;
  return (
    <div className={`form-field${className ? ` ${className}` : ""}`}>
      <label className="form-label" htmlFor={id}>{label}{required && <span className="form-field-required" aria-hidden="true"> *</span>}</label>
      <input className="form-control" id={id} required={required} {...props} />
    </div>
  );
}

export function SelectField({ label, options, required = false, id: providedId, ...props }) {
  const generatedId = useId();
  const id = providedId || generatedId;
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>{label}{required && <span className="form-field-required" aria-hidden="true"> *</span>}</label>
      <select className="form-control form-select" id={id} required={required} {...props}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

export function Checkbox({ label, ...props }) {
  return <label className="form-checkbox-label"><input {...props} className="form-check-input form-checkbox" type="checkbox" />{label}</label>;
}

export function Toggle({ label, checked, onChange, readOnly = false }) {
  const id = useId();
  if (readOnly) {
    return <span className={`form-toggle-status${checked ? " is-on" : ""}`} role="img" aria-label={`${label}: ${checked ? "활성" : "비활성"}`}><span className="switch-label"><span className="onoff-btn" /><span className="switch-state" aria-hidden="true" /></span></span>;
  }
  return (
    <span className="form-switch">
      <input id={id} className="switch" type="checkbox" role="switch" aria-label={label} checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <label className="switch-label" htmlFor={id}><span className="onoff-btn" /><span className="switch-state" aria-hidden="true" /></label>
    </span>
  );
}

export function FormActions({ onCancel, submitLabel = "저장" }) {
  return <div className="form-actions"><button type="submit" className="btn btn-primary btn-lg">{submitLabel}</button><button type="button" className="btn btn-secondary btn-lg" onClick={onCancel}>취소</button></div>;
}
