SET @from = '2026-11-01';
SET @to   = '2026-11-30';

Select c.id, c.full_name AS Nombre, SUM(l.requested_amount) AS Total
FROM loan_application l
Inner join client c ON c.id = l.client_id
Where l.status = 'approved'
  And l.created_at >= @from 
  And l.created_at <   DATE_ADD(@to, INTERVAL 1 DAY)
Group  By c.id, c.full_name;