Select c.id, c.full_name AS Nombre, SUM(la.requested_amount) AS Total_Aprobado
From loan_application la
Inner join client c ON c.id = la.client_id
Where la.status = 'approved'
  AND la.created_at >= MAKEDATE(YEAR(UTC_DATE()), 1) 
Group by c.id, c.full_name
Order by Total_aprovado DESC                          
LIMIT 5;                                            