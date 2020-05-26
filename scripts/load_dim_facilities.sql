delete from portalDev.dim_facility;

insert into portalDev.dim_facility
select distinct
       MFLCode facilityId,
       `Facility Name` name,
       county,
       Sub_County subCounty,
       `SDP Agency`  agency,
       `Service Delivery Partner` partner,
       ownership,
       0 isCT,
       0 isPkv,
       0 isHts
from his_implementation.all_emr_sites_jan2020 where MFLCode is not null;


update
portalDev.dim_facility set isCt=1,isPkv=1
where facilityId in (select MFLCode from his_implementation.emrsites);

update
portalDev.dim_facility set isHts=1
where facilityId in (select MFLCode from his_implementation.ehtssites);
