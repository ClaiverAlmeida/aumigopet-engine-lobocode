/**
 * 📅 FORMATADOR DE DATA CENTRALIZADO
 * 
 * Utilitário para formatação de datas em notificações.
 * Formato brasileiro: "04:13 do dia 06/10/2025"
 */

export class DateFormatter {
  /**
   * 📅 Formata data e hora no formato brasileiro
   * Exemplo: "04:13 do dia 06/10/2025"
   */
  static formatDateTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${hours}:${minutes} do dia ${day}/${month}/${year}`;
  }

  /**
   * 📅 Formata apenas a data
   * Exemplo: "06/10/2025"
   */
  static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * 🕐 Formata apenas a hora
   * Exemplo: "04:13"
   */
  static formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  /**
   * 📅 Formata data relativa (há quanto tempo)
   * Exemplo: "há 2 horas", "há 1 dia"
   */
  static formatRelative(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;
    
    return this.formatDate(date);
  }
}
