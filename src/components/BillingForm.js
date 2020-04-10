import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { CardElement, injectStripe } from "react-stripe-elements";
import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./BillingForm.css";

function BillingForm({ isLoading, onSubmit, ...props }) {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  isLoading = isProcessing || isLoading;

  function validateForm() {
    return fields.name !== "" && fields.storage !== "" && isCardComplete;
  }

  async function handleSubmitClick(event) {
    event.preventDefault();
    setIsProcessing(true);
    const { token, error } = await props.stripe.createToken({
      name: fields.name,
    });
    setIsProcessing(false);
    onSubmit(fields.storage, { token, error });
  }

  return (
    <Form className="BillingForm" onSubmit={handleSubmitClick}>
      <Form.Group controlId="storage">
        <Form.Label>Storage</Form.Label>
        <Form.Control
          type="number"
          min="0"
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
          value={fields.storage}
        />
      </Form.Group>
      <Form.Group controlId="name">
        <Form.Label>Cardholder's name</Form.Label>
        <Form.Control
          type="text"
          onChange={handleFieldChange}
          placeholder="Name on the card"
          value={fields.name}
        />
      </Form.Group>
      <Form.Label>Credit Card Info</Form.Label>
      <CardElement
        className="card-field"
        onChange={(e) => setIsCardComplete(e.complete)}
        style={{
          base: { fontSize: "18px", fontFamily: '"Open Sans", sans-serif' },
        }}
      />
      <LoaderButton
        block
        variant="primary"
        disabled={!validateForm()}
        isLoading={isLoading}
        type="submit"
      >
        Purchase
      </LoaderButton>
    </Form>
  );
}

export default injectStripe(BillingForm);
