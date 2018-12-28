import * as WebTorrent from 'webtorrent'

export function downloadTorrentFile(torrentId, path, callback) {
  if (!torrentId) return callback('torrentId is null')

  console.log('create web torrent client')
  const client = new WebTorrent()

  client.add(torrentId, { path }, function(torrent) {

    torrent.on('download', function () {
      callback(null, {progress: torrent.progress, name: torrent.name})
    })

    var file = torrent.files.find(function(file) {
      return file.name.endsWith('.warp')
    })
    console.log('file', file)
    callback(null, file)
  })
}
