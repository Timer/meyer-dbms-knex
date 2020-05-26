-- up:begin
create table jow
(
  id integer primary key not null
);
insert into jow
values
  (7),
  (8),
  (9),
  (10);

-- up:end

-- down:begin
drop table jow;
-- down:end
