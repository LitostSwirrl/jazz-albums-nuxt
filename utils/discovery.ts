import type { Album, Artist } from '~/types'

export function getAllGenres(albums: Album[]): string[] {
  const genreSet = new Set<string>()
  albums.forEach((album) => {
    album.genres.forEach((genre) => genreSet.add(genre))
  })
  return Array.from(genreSet).sort()
}

export function getAllLabels(albums: Album[]): string[] {
  const labelSet = new Set<string>()
  albums.forEach((album) => labelSet.add(album.label))
  return Array.from(labelSet).sort()
}

export function getAllInstruments(artists: Artist[]): string[] {
  const instrumentSet = new Set<string>()
  artists.forEach((artist) => {
    artist.instruments.forEach((inst) => instrumentSet.add(inst))
  })
  return Array.from(instrumentSet).sort()
}

export function getRelatedAlbums(
  currentAlbum: Album,
  allAlbums: Album[],
  limit: number = 4,
): { genre: Album[]; label: Album[]; year: Album[]; artist: Album[] } {
  const otherAlbums = allAlbums.filter((a) => a.id !== currentAlbum.id)

  const genre = otherAlbums
    .filter((a) => a.genres.some((g) => currentAlbum.genres.includes(g)))
    .slice(0, limit)

  const label = otherAlbums.filter((a) => a.label === currentAlbum.label).slice(0, limit)

  const year = otherAlbums
    .filter((a) => Math.abs(a.year - currentAlbum.year) <= 2)
    .slice(0, limit)

  const artist = otherAlbums
    .filter((a) => a.artistId === currentAlbum.artistId)
    .slice(0, limit)

  return { genre, label, year, artist }
}

export function getRandomAlbum(
  albums: Album[],
  exclude?: string,
  filter?: { era?: string; genre?: string; label?: string },
): Album | null {
  let filtered = albums

  if (exclude) {
    filtered = filtered.filter((a) => a.id !== exclude)
  }

  if (filter?.era) {
    filtered = filtered.filter((a) => a.era === filter.era)
  }

  if (filter?.genre) {
    filtered = filtered.filter((a) =>
      a.genres.some((g) => g.toLowerCase() === filter.genre!.toLowerCase()),
    )
  }

  if (filter?.label) {
    filtered = filtered.filter(
      (a) => a.label.toLowerCase() === filter.label!.toLowerCase(),
    )
  }

  if (filtered.length === 0) return null

  return filtered[Math.floor(Math.random() * filtered.length)]
}
