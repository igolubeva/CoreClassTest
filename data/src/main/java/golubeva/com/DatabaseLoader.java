
package golubeva.com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final SourceRepository repository;

	@Autowired
	public DatabaseLoader(SourceRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
		this.repository.save(new Source(1,"AAA", 1.02));
		this.repository.save(new Source( 2,"AAB", 1.5));
		this.repository.save(new Source( 3, "AAC", 2));
		this.repository.save(new Source( 4, "AAD", 2));
		this.repository.save(new Source( 5, "AAE", 1.9));
		this.repository.save(new Source( 6, "AAF", 1.53));
		this.repository.save(new Source( 7, "AAG", 1.6));
		this.repository.save(new Source(8, "AAH", 1.46));
		this.repository.save(new Source( 9, "AAI", 1.01));
		this.repository.save(new Source( 10, "AAJ", 1.08));
	}
}
// end::code[]