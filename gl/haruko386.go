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
	world := &Life{} // -Infinity
	me := &Me{}      // 2002-04/28

	world.ctx = context.Background()

	go func() {
		for {
			select {
			case <-world.ctx.Done():
				break
			default:
				world.Execute(me)
			}
		}
	}()

	log.Println("Farewell, hopes you could live a happy life with happy ending")
}
