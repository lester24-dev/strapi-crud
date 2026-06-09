/**
 * client controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::client.client' , ({strapi}) => ({
     async find(ctx) {
     // Get query params (with defaults)
    const page = parseInt((ctx.query.page as string) || '1', 10);
    const pageSize = parseInt((ctx.query.pageSize as string) || '10', 10);
    const filters = (ctx.query.filters ?? {}) as Record<string, any>;

    // Merge filters (ensure deleted_at IS NULL)
    ctx.query = {
      ...ctx.query,
      filters: {
        ...filters,
        deleted_at: { $null: true },
        statuses: ctx.query.status,
        client_name: { $containsi: ctx.query.client_name as string }
      },
      pagination: {
        page,
        pageSize,
      },
    };

     const { data, meta } = await super.find(ctx);

        return {
        data,
        meta: {
            pagination: {
            page,
            pageSize,
            pageCount: meta.pagination.pageCount || 1,
            total: meta.pagination.total || data.length,
            },
        },
        };
    },
}));
