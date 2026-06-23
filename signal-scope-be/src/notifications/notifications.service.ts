import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DbService) {}

  async getAll() {
    const { rows } = await this.db.query<{
      id: number; level: string; source: string; title: string;
      detail: string | null; is_read: boolean; created_at: Date;
    }>(`
      SELECT id, level, source, title, detail, is_read, created_at
      FROM notifications
      ORDER BY created_at DESC
    `);

    return rows.map((n) => ({
      id:     n.id,
      level:  n.level,
      source: n.source,
      title:  n.title,
      detail: n.detail ?? '',
      time:   n.created_at.toTimeString().slice(0, 8),
      read:   n.is_read,
    }));
  }

  async markRead(id: number) {
    await this.db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1',
      [id],
    );
    return { ok: true };
  }

  async markAllRead() {
    await this.db.query('UPDATE notifications SET is_read = true');
    return { ok: true };
  }
}
