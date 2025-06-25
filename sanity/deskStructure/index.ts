import { CalendarIcon, UsersIcon, PinIcon } from '@sanity/icons';

export const structure = (S: any) =>
  S.list()
    .id('root')
    .title('投稿管理')
    .items([
      S.listItem()
        .id('upcomingPosts')
        .title('Upcoming Posts')
        .schemaType('event')
        .icon(CalendarIcon)
        .child(
          S.documentList()
            .title('Upcoming Posts')
            .filter('_type == "event" && date >= now()')
        ),
      S.listItem()
      .title('Past Posts')
      .schemaType('event')
      .icon(CalendarIcon)
      .child(
        S.documentList()
          .id('pastPosts')
            .title('Past Posts')
            .filter('_type == "event" && date < now()')
        ),
      S.divider(),
      S.documentTypeListItem('author').title('Author').icon(UsersIcon),
      S.documentTypeListItem('category').title('Categories').icon(PinIcon),
    ]);
