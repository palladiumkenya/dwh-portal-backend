import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMetabaseMonthlyHighlightQuery } from '../impl/metabase-monthly-highlight.query';
import { sign } from 'jsonwebtoken';

@QueryHandler(GetMetabaseMonthlyHighlightQuery)
export class GetMetabaseMonthlyHighlightHandler implements IQueryHandler<GetMetabaseMonthlyHighlightQuery>{

    async execute(query: GetMetabaseMonthlyHighlightQuery): Promise<any> {
        const METABASE_SITE_URL = "https://metabase.kenyahmis.org";
        const METABASE_SECRET_KEY = '919930fd2520f0ea5d890526bdb68daaaa37b8412dba0108a86dba5add85be44';

        let payload = {
            resource: { dashboard: 56 },
            params: {}
        };
        let token = sign(payload, METABASE_SECRET_KEY);

        return {url: METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true"};
    }

}
