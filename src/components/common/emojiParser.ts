const EMOJI_MAP: Record<string, string> = {
  ':bulb:': '💡',
  ':bulb;': '💡',
  ':ideas:': '💡',
  ':speech_balloon:': '💬',
  ':speech_balloon;': '💬',
  ':chat:': '💬',
  ':general:': '💬',
  ':raised_hands:': '🙌',
  ':raised_hands;': '🙌',
  ':show_and_tell:': '🙌',
  ':tada:': '🎉',
  ':sparkles:': '✨',
  ':rocket:': '🚀',
  ':bug:': '🐛',
  ':question:': '❓',
  ':q_and_a:': '❓',
  ':q_a:': '❓',
  ':mega:': '📢',
  ':loudspeaker:': '📢',
  ':announcements:': '📢',
  ':heart:': '❤️',
  ':fire:': '🔥',
  ':star:': '⭐',
  ':package:': '📦',
  ':warning:': '⚠️',
  ':white_check_mark:': '✅',
  ':x:': '❌',
  ':lock:': '🔒',
  ':unlock:': '🔓',
  ':key:': '🔑',
  ':zap:': '⚡',
  ':eyes:': '👀',
  ':hammer:': '🔨',
  ':wrench:': '🔧',
  ':gear:': '⚙️',
  ':memo:': '📝',
  ':book:': '📖',
  ':link:': '🔗',
  ':pin:': '📌',
  ':trophy:': '🏆',
  ':heavy_check_mark:': '✔️',
  ':recycle:': '♻️',
  ':art:': '🎨',
  ':construction:': '🚧',
  ':rotating_light:': '🚨',
  ':100:': '💯',
};

export function parseEmoji(input: string | null | undefined): string {
  if (!input) return '💬';

  const trimmed = input.trim();
  if (EMOJI_MAP[trimmed.toLowerCase()]) {
    return EMOJI_MAP[trimmed.toLowerCase()];
  }

  // Replace any embedded shortcodes :xyz: inside the string
  return trimmed.replace(/:([a-z0-9_+-]+)[:;]/gi, (match) => {
    const key = match.toLowerCase().replace(';', ':');
    return EMOJI_MAP[key] || match;
  });
}
