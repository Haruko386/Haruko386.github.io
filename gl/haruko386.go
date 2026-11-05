/* context.Json("Live my Happy life (2026/7/24)") */

type Me struct {
	time.Time
	Me      struct{}
	they    sync.Map
	she     unique.Handle[types.Var]
	in      <-chan any
	freedom any
	wg      sync.WaitGroup
}

func main() {
	life := &Life{}
	me := &Me{}

	life.ctx = context.Background()

	go func() {
		for {
			select {
			case <-life.ctx.Done():
				break
			default:
				life.Execute(me)
			}
		}
	}()

	log.Println("Farewell, hopes you could live a happy life with happy ending")
}
