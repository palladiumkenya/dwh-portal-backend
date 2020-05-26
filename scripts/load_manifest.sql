delete from portalDev.fact_manifest;

insert into portalDev.fact_manifest
select
       max(m.id) manifestId,
       date(max(m.DateRecieved)) timeId,
       max(m.SiteCode) facilityId,
       max(coalesce(NULLIF(h.`EMR IN USE`, ''),'Unkown')) emrId,
       'CT' docketId,
       1 upload

from dwapicentral.facilitymanifest m inner join his_implementation.all_emr_sites_jan2020 h
on m.SiteCode=h.MFLCode

group by year(DateRecieved),month(DateRecieved),SiteCode;

insert into portalDev.fact_manifest
select
       max(m.id) manifestId,
       date(max(m.DateArrived)) timeId,
       max(m.SiteCode) facilityId,
       max(coalesce(NULLIF(h.`EMR IN USE`, ''),'Unkown')) emrId,
       'HTS' docketId,
       1 upload

from htscentral.manifests m inner join his_implementation.all_emr_sites_jan2020 h
on m.SiteCode=h.MFLCode

group by year(DateArrived),month(DateArrived),SiteCode;

insert into portalDev.fact_manifest
select
       max(m.id) manifestId,
       date(max(m.DateArrived)) timeId,
       max(m.SiteCode) facilityId,
       max(coalesce(NULLIF(h.`EMR IN USE`, ''),'Unkown')) emrId,
       'PKV' docketId,
       1 upload

from cbscentral.manifests m inner join his_implementation.all_emr_sites_jan2020 h
on m.SiteCode=h.MFLCode

group by year(DateArrived),month(DateArrived),SiteCode;



