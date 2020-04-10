import React from "react";
import { Button } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <ArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
}
