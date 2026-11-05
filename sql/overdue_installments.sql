Select
  i.id AS id_cuota,
  c.full_name AS Nombre,
  la.id AS Id_Solicitud,
  i.due_date AS Fecha_De_Vencimiento,
  i.amount AS Monto_De_Cuota,
  DATEDIFF(UTC_DATE(), i.due_date) AS Dias_De_Atraso
FROM installment i
Inner Join loan_application la ON la.id = i.loan_application_id
Inner Join client c ON c.id = la.client_id
WHERE i.paid = FALSE
  and i.due_date < UTC_DATE()
order by i.due_date ASC;