// UiButton – Button im Stil „Comic-Kontur“ (Richtung A) für Phaser 3.
//
// Ersetzt die bisherige Button-Klasse (im Build „Q“) mit derselben Grundidee: Container mit
// Hintergrund-Grafik, Beschriftung, Tipp-Verhalten, setText/setEnabled. Neu sind die dunkle
// Kontur, die Lichtkante, der Sockel, der Druckzustand und Symbole statt Emoji.
//
// Erwartet, dass die Symbole als Texturen geladen sind, z. B. im Preload:
//   this.load.svg('ui-play', 'assets/icons/ui/play.svg', { width: 48, height: 48 });
//   this.load.svg('special-sleep', 'assets/icons/specials/sleep.svg', { width: 96, height: 96 });
// Weiße Leisten-Symbole werden mit der Textfarbe getönt, farbige Spezialkräfte-Symbole nicht.

import Phaser from 'phaser';

export const UI_FONT = '"Fredoka", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif';

export const UI_COLORS = {
  ink: 0x1b1026,
  text: '#fff4fb',
  textDark: '#143012',
  textGold: '#3a2a00',
  accent: 0xff5fa2, accentDark: 0xc23a78,
  panel: 0x3b2a55, panelDark: 0x1d1230,
  go: 0x7cff6b, goDark: 0x3f9a36,
  gold: 0xffd84d, goldDark: 0xb78f10,
  hud: 0x2a1a3e, hudDark: 0x120a1c,
  cost: '#ffd84d',
};

export const UI_METRICS = {
  radius: 18,     // Eckenradius
  outline: 3,     // dunkle Kontur
  lip: 6,         // Sockel unter dem Knopf
  minTouch: 52,   // Mindestgröße für den Daumen
  highlight: 0.17 // Deckkraft der Lichtkante
};

export type UiButtonOptions = {
  width?: number;
  height?: number;
  fontSize?: number;
  /** Füllfarbe, Standard Akzent-Pink. Der Sockel wird passend dunkler gewählt. */
  color?: number;
  /** Sockelfarbe, falls nicht automatisch abgeleitet werden soll. */
  colorDark?: number;
  textColor?: string;
  /** Textur-Key eines Symbols links vom Text (oder allein, wenn label leer ist). */
  icon?: string;
  iconSize?: number;
  /** true: Symbol ist farbig (Spezialkraft) und wird nicht getönt. */
  iconColored?: boolean;
  /** Kosten unter dem Symbol (layout 'stack') oder rechts vom Text (layout 'row'). */
  cost?: number | string;
  /** Textur-Key für das Kosten-Symbol, z. B. 'ui-bolt' (Energie) oder 'ui-coin' (Gold). */
  costIcon?: string;
  costIconColored?: boolean;
  layout?: 'row' | 'stack';
  sounds?: { tap?: () => void; denied?: () => void };
  onTap: () => void;
};

export class UiButton extends Phaser.GameObjects.Container {
  private base: Phaser.GameObjects.Graphics;
  private face: Phaser.GameObjects.Container;
  private faceBg: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  private costText?: Phaser.GameObjects.Text;
  private readonly btnW: number;
  private readonly btnH: number;
  private readonly opts: UiButtonOptions;
  enabled = true;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, opts: UiButtonOptions) {
    super(scene, x, y);
    this.opts = opts;
    const m = UI_METRICS;
    const iconOnly = !text && !!opts.icon;
    this.btnW = Math.max(opts.width ?? (iconOnly ? m.minTouch : 360), m.minTouch);
    this.btnH = Math.max(opts.height ?? m.minTouch, m.minTouch);
    const color = opts.color ?? UI_COLORS.accent;
    const dark = opts.colorDark ?? darken(color, 0.55);
    const w = this.btnW, h = this.btnH;

    // Kontur und Sockel (bleiben beim Drücken stehen)
    this.base = scene.add.graphics();
    this.base.fillStyle(UI_COLORS.ink, 1)
      .fillRoundedRect(-w / 2 - m.outline, -h / 2 - m.outline, w + m.outline * 2, h + m.outline * 2 + m.lip, m.radius + m.outline);
    this.base.fillStyle(dark, 1).fillRoundedRect(-w / 2, -h / 2 + m.lip, w, h, m.radius);

    // Fläche mit Lichtkante, Beschriftung und Symbol (sinkt beim Drücken auf den Sockel)
    this.face = scene.add.container(0, 0);
    this.faceBg = scene.add.graphics();
    this.faceBg.fillStyle(color, 1).fillRoundedRect(-w / 2, -h / 2, w, h, m.radius);
    this.faceBg.fillStyle(0xffffff, m.highlight)
      .fillRoundedRect(-w / 2 + 5, -h / 2 + 4, w - 10, h * 0.4, { tl: m.radius - 5, tr: m.radius - 5, bl: 7, br: 7 });
    this.face.add(this.faceBg);

    const textColor = opts.textColor ?? UI_COLORS.text;
    const fontSize = opts.fontSize ?? (iconOnly ? 24 : 22);
    this.label = scene.add.text(0, 0, text, {
      fontFamily: UI_FONT, fontSize: `${fontSize}px`, fontStyle: '600', color: textColor, align: 'center',
    }).setOrigin(0.5);
    this.face.add(this.label);

    const layout = opts.layout ?? 'row';
    let icon: Phaser.GameObjects.Image | undefined;
    if (opts.icon) {
      const size = opts.iconSize ?? (iconOnly ? Math.round(h * 0.5) : Math.round(fontSize * 1.15));
      icon = scene.add.image(0, 0, opts.icon).setDisplaySize(size, size);
      if (!opts.iconColored) icon.setTint(Phaser.Display.Color.HexStringToColor(textColor).color);
      this.face.add(icon);
    }

    if (layout === 'stack') {
      // Spezialkraft: Symbol oben, Kosten unten
      const costY = h / 2 - 14;
      if (icon) icon.setY(-h / 2 + (opts.iconSize ?? 34) / 2 + 6);
      this.label.setY(costY);
      if (opts.cost !== undefined) this.addCost(scene, costY, textColor, true);
    } else {
      // Zeile: [Symbol] Text [Kosten]
      const parts: number[] = [];
      const gap = 10;
      if (icon) parts.push(icon.displayWidth);
      if (text) parts.push(this.label.width);
      let costW = 0;
      if (opts.cost !== undefined) { costW = this.addCost(scene, 0, textColor, false); parts.push(costW); }
      const total = parts.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
      let cx = -total / 2;
      if (icon) { icon.setX(cx + icon.displayWidth / 2); cx += icon.displayWidth + gap; }
      if (text) { this.label.setX(cx + this.label.width / 2); cx += this.label.width + gap; }
      if (this.costText) this.costText.setX(cx + costW / 2 + (opts.costIcon ? 10 : 0));
    }

    this.add([this.base, this.face]);
    this.setSize(w + m.outline * 2, h + m.outline * 2 + m.lip);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => this.setPressed(true));
    this.on('pointerout', () => this.setPressed(false));
    this.on('pointerup', () => {
      this.setPressed(false);
      if (this.enabled) { opts.sounds?.tap?.(); opts.onTap(); }
      else { opts.sounds?.denied?.(); this.shake(); }
    });
    scene.add.existing(this);
  }

  private addCost(scene: Phaser.Scene, y: number, textColor: string, stacked: boolean): number {
    const o = this.opts;
    const size = stacked ? 18 : 17;
    const txt = scene.add.text(0, y, String(o.cost), {
      fontFamily: UI_FONT, fontSize: `${size}px`, fontStyle: '700', color: stacked ? UI_COLORS.cost : textColor,
    }).setOrigin(0.5);
    this.costText = txt;
    let width = txt.width;
    if (o.costIcon) {
      const ic = scene.add.image(0, y, o.costIcon).setDisplaySize(size, size);
      if (!o.costIconColored) ic.setTint(Phaser.Display.Color.HexStringToColor(stacked ? UI_COLORS.cost : textColor).color);
      width += size + 2;
      if (stacked) { ic.setX(-txt.width / 2 - size / 2 - 1); txt.setX(size / 2 + 1); }
      else { ic.setX(-txt.width / 2 - size / 2 - 1 + 10); }
      this.face.add(ic);
    } else if (stacked) {
      txt.setX(0);
    }
    this.face.add(txt);
    return width;
  }

  private setPressed(down: boolean) {
    this.face.setY(down && this.enabled ? UI_METRICS.lip - 1 : 0);
  }

  private shake() {
    const x = this.x;
    this.scene.tweens.add({ targets: this, x: x + 8, duration: 50, yoyo: true, repeat: 2, onComplete: () => this.setX(x) });
  }

  setText(text: string): this {
    if (this.label.text !== text) this.label.setText(text);
    return this;
  }

  /** Kosten nachziehen, z. B. wenn der Cooldown läuft („12s“) oder die Energie reicht. */
  setCost(cost: number | string): this {
    this.costText?.setText(String(cost));
    return this;
  }

  setEnabled(enabled: boolean): this {
    if (enabled === this.enabled) return this;
    this.enabled = enabled;
    this.setAlpha(enabled ? 1 : 0.45);
    return this;
  }
}

/** Dunklere Variante einer Farbe für den Sockel (Faktor 0..1, 1 = unverändert). */
export function darken(color: number, factor: number): number {
  const c = Phaser.Display.Color.IntegerToColor(color);
  return Phaser.Display.Color.GetColor(Math.round(c.red * factor), Math.round(c.green * factor), Math.round(c.blue * factor));
}
