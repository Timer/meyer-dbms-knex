-- up:begin
create table def
(
  id integer primary key not null
);
insert into def
values
  (4),
  (5),
  (6);

-- up:end

-- down:begin
drop table def;
-- down:end
