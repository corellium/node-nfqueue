{
  "targets": [
    {
      "target_name": "nfqueue",
      "conditions":[
        ["OS=='linux'", {
          "sources": [
            "src/node_nfqueue.cpp"
          ],
          "libraries": [
            "-lnetfilter_queue"
          ],
          "cflags": [
            "-fpermissive"
          ],
          "include_dirs" : [
            "<!(node -e \"require('nan')\")"
          ]
        }]
      ]
    }
  ]
}
