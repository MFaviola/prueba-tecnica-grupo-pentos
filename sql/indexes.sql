
CREATE INDEX idx_installment_paid_due_date ON installment (paid, due_date);

CREATE INDEX idx_loan_application_status_created_at ON loan_application (status, created_at);

