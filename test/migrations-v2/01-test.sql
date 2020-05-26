-- up:begin
create table abc
(
  id integer primary key not null
);
insert into abc
values
  (1),
  (2),
  (3);

-- up:end

-- down:begin
drop table abc;
-- down:end
