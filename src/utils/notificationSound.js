let audioContext

export function playNotificationSound(kind = 'request') {
  try {
    audioContext ||= new AudioContext()
    if (audioContext.state === 'suspended') audioContext.resume()

    const now = audioContext.currentTime
    const frequencies = kind === 'confirmed' ? [660, 880] : [520, 700]
    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, now + index * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.12 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.2)
      oscillator.connect(gain).connect(audioContext.destination)
      oscillator.start(now + index * 0.12)
      oscillator.stop(now + index * 0.12 + 0.22)
    })
  } catch {
    // Browsers can block audio until the page has received user interaction.
  }
}
